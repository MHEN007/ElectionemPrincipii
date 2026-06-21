import { MemberRepository } from "../repository/MemberRepository";

export class MemberController {
    public static async GetMemberVoteStatus() {
        return await MemberRepository.GetMemberVoterStatus();
    }
}