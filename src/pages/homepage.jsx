import { PageTitle } from "../components/pagetitle";

export function HomePage() {
  return (
    <>
      <PageTitle><p>Welcome to HRM-Attendance and LabourShift</p></PageTitle>
      <div className="min-h-full mt-10 border-2 px-2 md:px-32 flex flex-col justify-center gap-4">
        Here You can mark attendance for labours and assign shift
      </div>
    </>
  )
}