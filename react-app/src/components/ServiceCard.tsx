

type ServiceCardProps = {
    icon: string; 
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
    link // this is the link to service page for the button, can search up later maybe? 
}:  ServiceCardProps) {
    return (
        <div> 
            <div>
                <img src={icon}/>
                <h2>{serviceName}</h2>
            </div>
            <div>
                <h3>{serviceType}</h3>
            </div>
            <div>
                <p>{description}</p>
            </div>
            <div>
                <button/>
            </div>
        </div>
    );
}

