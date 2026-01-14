export interface Property {
  id: string;
  reference: string;
  title: string;
  description: string;

  price: number;
  operation: "sale" | "rent";
  operationLabel: string;

  status?: "available" | "unavailable";

  location: string;
  propertyType?: string;

  mainImage: string;
  images: string[];

  specs: {
    size: number;
    beds: number;
    baths: number;

    conservation?: string;
    year?: number;
    ibi?: number;
    exterior?: boolean;
  };

  energy?: {
    letter?: string | null;
    consumption?: number | null;
    emissionsLetter?: string | null;
    emissionsValue?: number | null;
  };

  features: string[];
}
