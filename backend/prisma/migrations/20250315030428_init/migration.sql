-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PVRA', 'SRVM', 'PEMBINA', 'CAMERLENGHI');

-- CreateTable
CREATE TABLE "Voter" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "kelompok" "Role" NOT NULL,
    "kelas" INTEGER NOT NULL,

    CONSTRAINT "Voter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotersPvra" (
    "id" SERIAL NOT NULL,
    "votedPraefect" BOOLEAN NOT NULL,
    "votedVicarius" BOOLEAN NOT NULL,

    CONSTRAINT "VotersPvra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotersSrvm" (
    "id" SERIAL NOT NULL,
    "votedVicaria" BOOLEAN NOT NULL,

    CONSTRAINT "VotersSrvm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotersPembina" (
    "id" SERIAL NOT NULL,
    "votedPraefect" BOOLEAN NOT NULL,
    "votedVicarius" BOOLEAN NOT NULL,
    "votedVicaria" BOOLEAN NOT NULL,

    CONSTRAINT "VotersPembina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "votedId" INTEGER NOT NULL,
    "roundId" INTEGER NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateView
CREATE VIEW "CandidatePraefect" AS (
    SELECT id, name FROM "Voter" WHERE kelas = 10 AND kelompok = 'PVRA'
);

-- CreateView
CREATE VIEW "CandidateVicarius" AS (
    SELECT id, name FROM "Voter" WHERE kelas = 11 AND kelompok = 'PVRA'
);

-- CreateView
CREATE VIEW "CandidateVicaria" AS (
    SELECT id, name FROM "Voter" WHERE kelas = 10 AND kelompok = 'SRVM'
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_votedId_key" ON "Vote"("votedId");

-- AddForeignKey
ALTER TABLE "VotersPvra" ADD CONSTRAINT "VotersPvra_id_fkey" FOREIGN KEY ("id") REFERENCES "Voter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotersSrvm" ADD CONSTRAINT "VotersSrvm_id_fkey" FOREIGN KEY ("id") REFERENCES "Voter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotersPembina" ADD CONSTRAINT "VotersPembina_id_fkey" FOREIGN KEY ("id") REFERENCES "Voter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_votedId_fkey" FOREIGN KEY ("votedId") REFERENCES "Voter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE CASCADE ON UPDATE CASCADE;
