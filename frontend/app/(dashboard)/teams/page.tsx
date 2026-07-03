import { CreateTeamModal } from "./components/create-team/create-team-modal";
import TeamsTable from "./components/show-teams/teams-table";

export default function Teams() {
  return (
    <>
      <CreateTeamModal />
      <TeamsTable />
    </>
  );
}
