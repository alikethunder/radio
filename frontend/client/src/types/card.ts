export type CardPageParams = {
    pageId: string,
    tab: string,
}

export type Card = {
    id: string;
    description: string;
    background: string;
    contacts: {
        provider: string;
        data: string;
    }[];
    
}