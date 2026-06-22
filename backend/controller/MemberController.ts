import { MemberRepository } from "../repository/MemberRepository";

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
}