

type ServiceCardProps = {
    icon: React.ReactNode;
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
}:  ServiceCardProps) {
    return (
        <div className="bg-white border border-black rounded-xl p-6 md:p-7 flex flex-col h-full w-full">
            <div className="flex flex-row items-center">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-400 rounded-full flex items-center justify-center mb-4 text-white">
                    {icon}
                </div>
                
                <h2 className="text-[23px] sm:text-xl md:text-3xl font-semibold text-[#1a1a2e] mb-2 ml-5">
                    {serviceName}
                </h2>
            </div>

            <h3 className="text-[17px] sm:text-base md:text-xl font-medium text-[#454545] mb-3">
                {serviceType}
            </h3>

            <p className="text-[15px] sm:text-base md:text-lg text-[#454545] leading-relaxed mb-5 flex-grow">
                {description}
            </p>

            <a
                href={link}
                className="w-full bg-yellow-400 text-[#1a1a2e] font-medium py-3 px-6 rounded-lg text-sm md:text-base text-center block"
            >
                View {serviceName} Dashboard
            </a>
        </div>
    );
}

