export interface Experience {
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    location: string;
    skills?: string[];
    description?: string[];
}

export interface Project {
    order: number;
    title: string;
    date: string;
    tech: string[];
    snapshot?: string;
    description?: string[];
    github?: string;
    demo?: string;
    link?: string;
}

export interface Education {
    degree: string;
    school: string;
    location: string;
    dates: string;
    description?: string[];
}
