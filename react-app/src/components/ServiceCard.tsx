

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
        <div className="bg-white border border-black rounded-xl p-6 md:p-7 flex flex-col h-full">
            <div className="flex flex-row items-center">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-400 rounded-full flex items-center justify-center mb-4 text-white">
                    {icon}
                </div>
                
                <h2 className="text-3xl font-semibold text-[#1a1a2e] mb-2 ml-5">
                    {serviceName}
                </h2>
            </div>

            <h3 className="text-xl font-medium text-[#454545] mb-3">
                {serviceType}
            </h3>

            <p className="text-sm text-[#454545] leading-relaxed mb-5 flex-grow">
                {description}
            </p>

            <button
                onClick={() => window.location.href = link}
                className="w-full bg-yellow-400 text-[#1a1a2e] font-medium py-3 px-6 rounded-lg text-sm md:text-base"
            >
                View {serviceName} Dashboard
            </button>
        </div>
    );
}

