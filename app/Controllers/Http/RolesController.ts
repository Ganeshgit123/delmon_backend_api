import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import { RolesDomain } from "../../Domain";
import { RoleRepo } from "../../Repositories";
// import { SUCCESS } from "../../Data/language";

export default class RolesController {

    public async get() {
        return {
            error: true,
            data: RolesDomain.createFromArrOfObject(
                await RoleRepo.get()
            ),
        };
    }

    public async create({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.RoleValidator);

        // const language = request.header('language') || 'en'
        let roleResult = await RoleRepo.isEntryExist(payload.roleName);

        if (!roleResult) {
            const rolesDetails = await RoleRepo.create(payload);
            return {
                error: true,
                result: RolesDomain.createFromObject(rolesDetails),
                massage: "Role creates successfully"
            };
        } else {
            return {
                error: true,
                massage: "Role already exist"
            };
        }
    }

    public async update({ request, params }: HttpContextContract) {
        const UpdatePost = request.all()

        // const language = request.header('language') || 'en'
        await RoleRepo.isRoleExist(params.id);

        const updateResult = RolesDomain.createFromObject(
            await RoleRepo.update(params.id, UpdatePost)
        );
        return {
            error: true,
            result: updateResult,
            massage: "Role updated successfully"
        };
    }

    public async delete({ params }: HttpContextContract) {
        // const language = request.header('language') || 'en'
        const result = await RoleRepo.isRoleExist(params.id);

        await RoleRepo.delete({ active: 0 }, result);
        return {
            error: true,
            massage: "Role deleted successfully"
        };

    }
}
