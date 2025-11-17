import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  buttonText: string;
  buttonColor: string;
  buttonHoverColor: string;
  href: string;
}

export default function ActionCard({
  title,
  description,
  icon: Icon,
  iconBgColor,
  buttonText,
  buttonColor,
  buttonHoverColor,
  href,
}: ActionCardProps) {
  return (
    <div className="flex flex-col bg-white w-full items-center rounded-2xl py-10 gap-6">
      <div className="flex flex-row w-10/12 items-center justify-center gap-3">
        <div className="flex flex-1 items-center justify-center">
          <div className={`${iconBgColor} p-3.5 rounded-2xl`}>
            <Icon />
          </div>
        </div>
        <div className="flex flex-col flex-5 gap-1">
          <div className="text-xl font-bold">
            {title}
          </div>
          <div>
            {description}
          </div>
        </div>
      </div>
      <Link
        href={href}
        className={`${buttonColor} text-white flex w-10/12 justify-center font-bold rounded-2xl py-3.5 hover:cursor-pointer ${buttonHoverColor} transition`}>
        {buttonText}
      </Link>
    </div>
  )
};