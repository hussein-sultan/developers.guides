import Btn from "@/components/shared/Btn";
import { paths } from "@/lib/paths";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <Btn text="View All Properties" path={paths.PROPERTIES.ROOT} />
    </div>
  );
}
