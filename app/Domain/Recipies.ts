
export default class RecipiesDomain {
    public readonly id: number
    public readonly name: string
    public readonly ingredients: string
    public readonly arIngredients: string
    public readonly active: boolean
    public readonly createdAt: string
    public readonly updatedAt: string
    public readonly steps: string
    public readonly arSteps: string
    public readonly categoryId: string
    public readonly videos: string
    public readonly thumbnailImage: string
    public readonly arName: string

    private constructor(id: number, name: string, ingredients: string, arIngredients: string, active: boolean, createdAt: string, updatedAt: string, steps: string, arSteps: string,
        categoryId: string, videos: string, thumbnailImage: string, arName: string) {

        this.id = id
        this.name = name
        this.ingredients = ingredients
        this.arIngredients = arIngredients
        this.active = active
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.steps = steps
        this.arSteps = arSteps
        this.categoryId = categoryId
        this.videos = videos
        this.thumbnailImage = thumbnailImage
        this.arName = arName
    }

    public static createFromObject(data: any) {
        return new RecipiesDomain(data.id, data.name, data.ingredients, data.arIngredients, data.active, data.createdAt, data.updatedAt,
            data.steps, data.arSteps, data.categoryId, data.videos, data.thumbnailImage, data.arName)
    }

    public static createFromArrOfObject(data: any) {
        return data.map((el) => {
            return new RecipiesDomain(el.id, el.name, el.ingredients, el.arIngredients, el.active, el.createdAt, el.updatedAt,
                el.steps, el.arSteps, el.categoryId, el.videos, el.thumbnailImage, el.arName)
        })
    }
} 