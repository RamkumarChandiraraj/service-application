
export const userSearch = async (searchPayload) => {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: [
                    {
                        id: 1,
                        companyName: "Speedy Two Wheelers",
                        description: "Fast and reliable two wheeler repair services.",
                        locationId: 1,
                        locationName: "Thoppampatti",
                        serviceId: 10,
                        serviceName: "Two Wheeler Service",
                        createdDate: "0001-01-01T00:00:00",
                        createdBy: 0,
                        updatedDate: null,
                        updatedBy: 0,
                        deletedDate: null,
                        deletedBy: 0,
                        isActive: false,
                        latitude: 10.575725,
                        longitude: 77.528892,
                        mobile: ""
                    },
                    {
                        id: 2,
                        companyName: "Ace Bikes",
                        description: "Trusted two wheeler maintenance and repairs.",
                        locationId: 5,
                        locationName: "Keeranur",
                        serviceId: 10,
                        serviceName: "Two Wheeler Service",
                        createdDate: "0001-01-01T00:00:00",
                        createdBy: 0,
                        updatedDate: null,
                        updatedBy: 0,
                        deletedDate: null,
                        deletedBy: 0,
                        isActive: false,
                        latitude: 10.595409,
                        longitude: 77.501919,
                        mobile: ""                    },
                    {
                        id: 3,
                        companyName: "RideCare",
                        description: "Expert two wheeler servicing and repairs.",
                        locationId: 1,
                        locationName: "Thumpalapatti",
                        serviceId: 10,
                        serviceName: "Two Wheeler Service",
                        createdDate: "0001-01-01T00:00:00",
                        createdBy: 0,
                        updatedDate: null,
                        updatedBy: 0,
                        deletedDate: null,
                        deletedBy: 0,
                        isActive: false,
                        latitude: 10.53561,
                        longitude: 77.526304,
                        mobile: ""
                    },
                    {
                        id: 4,
                        companyName: "TwoWheel Pro",
                        description: "Reliable two wheeler repairs at affordable prices.",
                        locationId: 5,
                        locationName: "Keeranur",
                        serviceId: 10,
                        serviceName: "Two Wheeler Service",
                        createdDate: "0001-01-01T00:00:00",
                        createdBy: 0,
                        updatedDate: null,
                        updatedBy: 0,
                        deletedDate: null,
                        deletedBy: 0,
                        isActive: false,
                        latitude: 10.595409,
                        longitude: 77.501919,
                        mobile: ""
                    },
                    {
                        id: 5,
                        companyName: "Two Wheeler Thumpalapatti",
                        description: "Two wheeler mechanic from Thumpalapatti.",
                        locationId: 4,
                        locationName: "Thumpalapatti",
                        serviceId: 10,
                        serviceName: "Two Wheeler Service",
                        createdDate: "0001-01-01T00:00:00",
                        createdBy: 0,
                        updatedDate: null,
                        updatedBy: 0,
                        deletedDate: null,
                        deletedBy: 0,
                        isActive: false,
                        latitude: 10.53561,
                        longitude: 77.526304,
                        mobile: ""
                    }
                ]
            });
        }, 500);
    });
};
