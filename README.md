# partition-wall-estimate
Lightweight package used to estimate metal stud partition wall materials. It will return list of materials (tracks, studs, and drywalls) with necessary quantity.
## Instalation
#### NPM
`npm i partition-wall-estimate`

#### Import
```
import getMaterialsForWallAssembly from "partition-wall-estimate"
```

## Usage
By providing only desired length of partition wall
```
getMaterialsForWallAssembly(25);
```

By providing length and custom configuration
```
let config = {
    wall: {
        length: 0,
        height: 8
    },
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
};

getMaterialsForWallAssembly(25, config);
```