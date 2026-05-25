import content from "../lib/classroomContent";
import { useI18n } from "@/lib/i18n";
import ClassroomHeader from "../components/classroom/ClassroomHeader";
import ClassroomHero from "../components/classroom/ClassroomHero";
import ClassroomTeacherDesk from "../components/classroom/ClassroomTeacherDesk";
import ClassroomPrinciples from "../components/classroom/ClassroomPrinciples";
import ClassroomToolTable from "../components/classroom/ClassroomToolTable";
import ClassroomSplitLab from "../components/classroom/ClassroomSplitLab";
import ClassroomQA from "../components/classroom/ClassroomQA";
import ClassroomCTA from "../components/classroom/ClassroomCTA";
import ClassroomFooter from "../components/classroom/ClassroomFooter";

export default function Classroom() {
  const { lang, setLang } = useI18n();
  const t = content[lang] ?? content.en;

  return (
    <div className="min-h-screen bg-quartz">
      <ClassroomHeader t={t} lang={lang} setLang={setLang} />
      <ClassroomHero t={t} />
      <ClassroomTeacherDesk t={t} />
      <ClassroomPrinciples t={t} />
      <ClassroomToolTable t={t} />
      <ClassroomSplitLab t={t} />
      <ClassroomQA t={t} />
      <ClassroomCTA t={t} />
      <ClassroomFooter t={t} />
    </div>
  );
}
