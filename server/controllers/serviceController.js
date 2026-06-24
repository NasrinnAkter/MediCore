import {
  getServicesService,
  getServiceByIdService,
  createServiceService,
  updateServiceService,
  deleteServiceService,
} from "../services/serviceService.js";

export const getServices = async (req, res) => {
  try {
    const services = await getServicesService();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await getServiceByIdService(req.params.id);
    res.json(service);
  } catch (error) {
    const status = error.message === "Service not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const service = await createServiceService(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await updateServiceService(req.params.id, req.body);
    res.json(service);
  } catch (error) {
    const status = error.message === "Service not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const result = await deleteServiceService(req.params.id);
    res.json(result);
  } catch (error) {
    const status = error.message === "Service not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};
