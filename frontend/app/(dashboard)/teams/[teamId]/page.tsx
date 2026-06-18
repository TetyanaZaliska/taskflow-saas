import Link from "next/link";
import getTeam from "./get-team";
import { Button } from "@/components/ui/button";

interface SingleTeamProps {
  params: Promise<{ teamId: string }>;
}

export default async function SingleTeam({ params }: SingleTeamProps) {
  const team = await getTeam(+(await params).teamId);

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {team.name}
      </h2>
      <h4 className="scroll-m-20 font-semibold tracking-tight text-muted-foreground">
        {team.createdAt}
      </h4>
      <p>Some details will be soon</p>
      <Button variant="outline" className="w-full" asChild>
        <Link href={`/teams/${team.id}/members`}>Members</Link>
      </Button>
    </>
  );
}
