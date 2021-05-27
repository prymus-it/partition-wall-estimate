export interface Wall {
    height: number;
    length: number;
}

export interface Estimation {
    unitPrice: number;
    currency: string;

    sections?: number;
    length?: number;
    area?: number;
    quantity?: number;
    cost?: number;
}

export interface Drywall {
    name?: string;
    vendor?: string;
    width: number;
    height: number;
    thickness?: number;

    estimation: Estimation;
}

export interface Stud {
    name?: string;
    vendor?: string;
    depth?: number;
    length: number;
    flange?: number;

    estimation: Estimation;
}

export interface Track {
    name?: string,
    vendor?: string;
    depth?: number;
    length: number;
    flange?: number;

    estimation: Estimation;
}

export interface Material {
    name: string;
    quantity: number,
    totalCost: number,
}

export interface Assembly {
    wall: Wall;
    track: Track;
    stud: Stud;
    drywall: Drywall;

    lengthUnit?: string;

    materials?: Material[];
    totalCost?: number;
}

export function updateAssemblyWithRequiredTracks(assembly: Assembly) {
    let linearLength = assembly.wall.length * 2;
    let requiredQuantity = Math.ceil(linearLength / assembly.track.length);

    assembly.track.estimation.length = linearLength;
    assembly.track.estimation.quantity = requiredQuantity;
    assembly.track.estimation.cost = requiredQuantity * assembly.track.estimation.unitPrice;
}

export function updateAssemblyWithRequiredDrywalls(assembly: Assembly) {
    let requiredSections = Math.ceil(assembly.wall.length / assembly.drywall.width);
    let wallAreaToCover = assembly.wall.height * assembly.wall.length * 2;
    let drywallArea = assembly.drywall.height * assembly.drywall.width;
    let requiredDrywalls = Math.ceil(wallAreaToCover / drywallArea);

    assembly.drywall.estimation.sections = requiredSections;
    assembly.drywall.estimation.area = wallAreaToCover;
    assembly.drywall.estimation.quantity = requiredDrywalls;
    assembly.drywall.estimation.cost = requiredDrywalls * assembly.drywall.estimation.unitPrice;
}

export function updateAssemblyWithRequiredStuds(assembly: Assembly) {
    let distanceBetweenStuds = assembly.drywall.width / 2;
    let studSections = Math.ceil(assembly.wall.length / distanceBetweenStuds) + 1;

    if (!assembly.drywall.estimation.sections) {
        console.error("Drywalls must be calculated before studs");
        return;
    }

    assembly.stud.estimation.quantity = studSections;
    assembly.stud.estimation.cost = studSections * assembly.stud.estimation.unitPrice;
}

export function validateProperty(property: any): any {
    if (property == undefined || property == null) {
        console.error('property value is not valid');
        return undefined;
    }
    else {
        return property;
    }
}

export function updateAssemblyRequiredMaterials(assembly: Assembly) {
    assembly.materials = [
        {
            name: 'tracks',
            quantity: validateProperty(assembly.track.estimation.quantity),
            totalCost: validateProperty(assembly.track.estimation.cost)
        },
        {
            name: 'studs',
            quantity: validateProperty(assembly.stud.estimation.quantity),
            totalCost: validateProperty(assembly.stud.estimation.cost)

        },
        {
            name: 'drywalls',
            quantity: validateProperty(assembly.drywall.estimation.quantity),
            totalCost: validateProperty(assembly.drywall.estimation.cost)
        },
    ]
}

export function updateAssemblyTotalCost(assembly: Assembly) {
    if (!assembly.materials) {
        console.error("Assembly materials are not defined")
        return;
    }

    let totalCost = 0;

    for (let material of assembly.materials) {
        totalCost += material.totalCost;
    }

    assembly.totalCost = totalCost;
}

export default function getMaterialsForWallAssembly(wallLength: number, assembly?: Assembly): Material[] {
    let requestedWall: Wall = {
        height: 8,
        length: wallLength,
    }

    if (assembly == undefined) {
        assembly = {
            wall: requestedWall,
            track: {
                length: 10,
                estimation: {
                    unitPrice: 2.5,
                    currency: "USD",
                },
            },
            stud: {
                length: 10,
                estimation: {
                    unitPrice: 5.25,
                    currency: "USD",
                },
            },
            drywall: {
                height: 8,
                width: 4,
                estimation: {
                    unitPrice: 2.18,
                    currency: "USD",
                },
            },
            lengthUnit: "ft"
        }
    }

    updateAssemblyWithRequiredTracks(assembly);
    updateAssemblyWithRequiredDrywalls(assembly);
    updateAssemblyWithRequiredStuds(assembly);

    updateAssemblyRequiredMaterials(assembly);
    updateAssemblyTotalCost(assembly);

    if (!assembly.materials || assembly.materials.length < 1) {
        console.error("Assembly materials are not defined")
        return [];
    }

    // console.log(assembly)

    return assembly.materials;
}