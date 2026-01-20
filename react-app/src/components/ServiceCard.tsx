import { ReactNode } from "react";
import { Link } from "react-router";


type ServiceCardProps = {
    icon: ReactNode;
    serviceName: string;
    serviceType: string;
    description: string;
    link: string;
}

export default function ServiceCard({
    icon,
    serviceName,
    serviceType,
    description,
    link
}: ServiceCardProps) {
    return (
        <div className="bg-white border border-black rounded-xl p-6 md:p-7 flex flex-col h-full w-full">
            <div className="flex flex-row items-center">
                <div className="size-12 md:w-14 md:h-14 bg-bcgw-yellow-dark rounded-full flex items-center justify-center mb-4 text-white">
                    {icon}
                </div>

                <h1 className="text-[23px] sm:text-xl md:text-3xl font-semibold text-[#1a1a2e] mb-2 ml-5">
                    {serviceName}
                </h1>
            </div>

            <h1 className="text-[17px] sm:text-base md:text-xl font-medium text-[#454545] mb-3">
                {serviceType}
            </h1>

            <p className="text-[15px] sm:text-base md:text-lg text-[#454545] leading-relaxed mb-5 grow">
                {description}
            </p>

            <Link
                to={link}
                className="bg-bcgw-yellow-dark hover:bg-bcgw-yellow-light border border-[#2C2C2C] text-bcgw-blue-dark disabled:bg-[#D9D9D9] min-h-9 px-4 has-[>svg]:px-3 flex items-center justify-center rounded-md transition-all py-2"
            >
                View {serviceName} Dashboard
            </Link>
        </div>
    );
}

