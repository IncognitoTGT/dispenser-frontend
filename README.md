# Getting Started
First, install the dependencies. 
```
pnpm i
#or 
npm i
```
Then clone the .env file
```
cp .env.example .env
```

# Mass domain import

JSON file that's an array, following the following TypeScript type:
```ts
export interface Import {
    domain: string;
    group: string;
}
```