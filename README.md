# WeAreSwissBorg

The association that supports you in your cryptographic adventure!

Mainly based around Swissborg, our community aims to educate and be a pillar in the field for newcomers as well as helping you to follow the evolution of this very special ecosystem.

## Installation

Requirement :
    - NodeJS v22.13
    - NPM 11.1
    - Sequelize V6
    - Sequeliez CLI V6

```bash
npm i
```

For database migrations. It is not recommended to create models from the CLI. This is because they remain in a format other than the one implemented as standard.

On the other hand, it is highly desirable to implement migrations. Even if, unfortunately, this will have to be done manually.
The same goes for data sets for models.
To do this : 

```bash
npx sequelize migration:generate --name init-your-model
npx sequelize seed:generate --name demo-model
```

Next we need to convert your model so that it matches the queryInterface

Finally, we can run the following command to generate the changes

```bash
npx sequelize db:migrate --env=ENV
npx sequelize db:seed:all --env=ENV
```