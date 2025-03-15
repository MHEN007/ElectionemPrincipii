import { VoteBody } from "../controller/vote.controller";
import { prisma } from "../db";

export class VoteRepository {
    static async getCurrentRound(): Promise<{ round: number }> {
        const round = await prisma.round.findFirst({
            select: {
                id: true
            },
            where: {
                status: true
            },
            orderBy: {
                startTime: 'desc'
            },
            take: 1
        })

        if (!round) {
            throw new Error("No active round");
        }

        return {round: round.id};
    }

    static async createVote(body: VoteBody): Promise<{ vote: string }> {
        return prisma.$transaction(async (tx) => {
            const group = await tx.voter.findFirst({
                select: {
                    kelompok: true
                },
                where: {
                    id: body.voterId
                }
            })

            // Check if the voter has voted
            let checkVoted = false;

            if (group) {
                switch (group.kelompok) {
                    case "PVRA":
                        const voterPvra = await tx.votersPvra.findFirst({
                            where: {
                                id: body.voterId
                            }
                        })

                        if (body.for === "praefect" && voterPvra?.votedPraefect) {
                            checkVoted = true;
                        } else if (body.for === "vicarius" && voterPvra?.votedVicarius) {
                            checkVoted = true;
                        }

                        break;

                    case "SRVM":
                        const voterSrvm = await tx.votersSrvm.findFirst({
                            where: {
                                id: body.voterId
                            }
                        })

                        if (body.for === "vicaria" && voterSrvm?.votedVicaria) {
                            checkVoted = true;
                        }

                        break;

                    case "PEMBINA":
                    case "CAMERLENGHI":
                        const voterPvra2 = await tx.votersPvra.findFirst({
                            where: {
                                id: body.voterId
                            }
                        })

                        const voterSrvm2 = await tx.votersSrvm.findFirst({
                            where: {
                                id: body.voterId
                            }
                        })

                        if (body.for === "praefect" && voterPvra2?.votedPraefect) {
                            checkVoted = true;
                        } else if (body.for === "vicarius" && voterPvra2?.votedVicarius) {
                            checkVoted = true;
                        } else if (body.for === "vicaria" && voterSrvm2?.votedVicaria) {
                            checkVoted = true;
                        }

                    default:
                        break;
                }
            }

            if (checkVoted) {
                throw new Error("User has voted");
            }

            // Create Vote
            await tx.vote.create({
                data: {
                    roundId: (await this.getCurrentRound()).round,
                    votedId: body.candidateId,
                }
            })

            // Update voter status
            if (group) {
                switch (group.kelompok) {
                    case "PVRA":

                        if (body.for === "praefect"){
                            await tx.votersPvra.update({
                                where: {
                                    id: body.voterId
                                },
                                data: {
                                    votedPraefect: true
                                }
                            })
                        } else if (body.for === "vicarius") {
                            await tx.votersPvra.update({
                                where: {
                                    id: body.voterId
                                },
                                data: {
                                    votedVicarius: true
                                }
                            })
                        }
                    
                        break;

                    case "SRVM":
                        if (body.for === "vicaria") {
                            await tx.votersSrvm.update({
                                where: {
                                    id: body.voterId
                                },
                                data: {
                                    votedVicaria: true
                                }
                            })
                        }

                        break;
                    
                    case "PEMBINA":
                    case "CAMERLENGHI":
                        if (body.for === "praefect"){
                            await tx.votersPvra.update({
                                where: {
                                    id: body.voterId
                                },
                                data: {
                                    votedPraefect: true
                                }
                            })
                        } else if (body.for === "vicarius") {
                            await tx.votersPvra.update({
                                where: {
                                    id: body.voterId
                                },
                                data: {
                                    votedVicarius: true
                                }
                            })
                        } else if (body.for === "vicaria") {
                            await tx.votersSrvm.update({
                                where: {
                                    id: body.voterId
                                },
                                data: {
                                    votedVicaria: true
                                }
                            })
                        }

                    default:
                        break;
                }
            }

            return { vote: "Vote created" };
        })
    }
}