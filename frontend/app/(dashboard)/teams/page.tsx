import { CreateTeamModal } from "./create-team/create-team-modal";
import TeamsTable from "./show-teams/teams-table";

export default function Teams() {
  return (
    <>
      <CreateTeamModal />
      <TeamsTable />
    </>
  );
}
