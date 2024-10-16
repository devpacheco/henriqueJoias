export interface ProductProps {
    id: string
    name: string;
    category: string;
    price: string;
    plot: string;
    init: string;
    final: string;
    description: string;
    created: string;
    user: string;
    images: ImageProps[];
}

interface ImageProps {
    name: string;
    user: string;
    url: string;
}