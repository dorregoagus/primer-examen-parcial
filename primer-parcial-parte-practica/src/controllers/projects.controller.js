
// ARCHIVO A COMPLETAR
import { matchedData } from "express-validator";
import {
  ProjectModel,
  TechnologyModel,
  UserModel,
} from "../models/index.js";

export const createProject = async (req, res) => {
  try {
    // TODO: 1. Crear el project con los datos del body que ya pasaron la validación.
    // ? Revisar de dónde debe salir el leader del proyecto.
    const projectData = matchedData(req);
    const technologies = projectData.technologies;
    delete projectData.technologies;

    const project = await ProjectModel.create({
      ...projectData,
      leader_id: req.user.id,
    });

    // TODO: 2. Asociar al project las technologies recibidas.
    await project.setTechnologies(technologies);

    // TODO: 3. Responder con código 201 y el project con sus technologies y su leader.
    const newProject = await ProjectModel.findByPk(project.id, {
      include: [
        { model: TechnologyModel, as: "technologies" },
        {
          model: UserModel,
          as: "leader",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    return res.status(201).json({ project: newProject });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getAllProjects = async (_req, res) => {
  try {
    // TODO: 1. Listar todos los projects incluyendo su leader (sin la password) y sus technologies, y responder con código 200 y los projects..
    const projects = await ProjectModel.findAll({
      include: [
        {
          model: UserModel,
          as: "leader",
          attributes: { exclude: ["password"] },
        },
        { model: TechnologyModel, as: "technologies" },
      ],
    });

    return res.status(200).json({ projects });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    // TODO: 1. Listar los projects cuyo leader sea el usuario logueado, incluyendo sus technologies, y responder con código 200 y los projects.
    const projects = await ProjectModel.findAll({
      where: { leader_id: req.user.id },
      include: [
        { model: TechnologyModel, as: "technologies" },
      ],
    });

    return res.status(200).json({ projects });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const updateProject = async (req, res) => {
  try {
    // TODO: 1. Actualizar el project con los datos recibidos.
    const projectData = matchedData(req);
    const technologies = projectData.technologies;
    delete projectData.technologies;

    const project = await ProjectModel.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    await project.update(projectData);

    // TODO: 2. Reemplazar sus technologies si vienen en el body.
    if (technologies !== undefined) {
      await project.setTechnologies(technologies);
    }

    // TODO: 3. Responder con código 200 y el project actualizado, incluyendo su leader y sus technologies.
    const updatedProject = await ProjectModel.findByPk(req.params.id, {
      include: [
        { model: TechnologyModel, as: "technologies" },
        {
          model: UserModel,
          as: "leader",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    return res.status(200).json({ project: updatedProject });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    // TODO: 1. Eliminar el project y responder con código 204 sin devolver ningún mensaje.
    const project = await ProjectModel.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    await project.destroy();

    return res.status(204).send();

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
