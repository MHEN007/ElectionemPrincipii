import { MemberRepository, type CreateMemberType, type MemberType } from "../repository/MemberRepository.js";
import { Readable } from "stream"
import csv from "csv-parser"
import bcrypt from "bcrypt"

export class MemberController {
    public static async GetMemberVoteStatus() {
        return await MemberRepository.GetMemberVoterStatus();
    }

    public static async GetMembers() {
        return await MemberRepository.GetMembers();
    }

    public static async UpdateStatus(member_id: string) {
        await MemberRepository.UpdateMemberStatus(member_id);
    }

    public static async CreateMembersfromFile(file: Readable) { 
        const listofMembers: CreateMemberType[] = [];

        await new Promise<void>( (resolve, reject) => {
            file
            .pipe(csv({separator: ";"}))
            .on('data', (d: CreateMemberType) => {
                const sanitizedMember = {
                    ...d,
                    // Compares the lowercased string against 'true' to get a clean boolean
                    isCandidate: String(d.isCandidate).toLowerCase().trim() === 'true',
                    admin: String(d.admin).toLowerCase().trim() === 'true'
                };

                listofMembers.push(sanitizedMember)
            })
            .on('end', () => resolve())
            .on('error', (error) => reject(error))
        })

        if (listofMembers.length==0)
            throw new Error("Failed to parse")

        const CONCURRENCY_LIMIT = 5;

        for (let i = 0; i < listofMembers.length; i += CONCURRENCY_LIMIT) {
            const batch = listofMembers.slice(i, i + CONCURRENCY_LIMIT);
            
            // This fires all operations in the current batch simultaneously
            await Promise.all(
                batch.map(async (member) => {
                    // Bcrypt leverages Node's underlying C++ threadpool natively
                    const encPassword = await bcrypt.hash(member.password, 12);
                    member.password = encPassword;

                    // Fire database query
                    await MemberRepository.AddMember(member);
                })
            );
        }

    }

    public static async DeleteMember(username: string, executor_id: string) {
        await MemberRepository.DeleteMember(username, executor_id)
    }
}