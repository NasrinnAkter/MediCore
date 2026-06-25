import {
  getNewsService,
  getNewsByIdService,
  getAllNewsAdminService,
  createNewsService,
  updateNewsService,
  deleteNewsService,
} from "../services/newsService.js";

export const getNews = async (req, res) => {
  try {
    const result = await getNewsService(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const post = await getNewsByIdService(req.params.id);
    res.json(post);
  } catch (error) {
    const status = error.message === "Post not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const getAllNewsAdmin = async (req, res) => {
  try {
    const news = await getAllNewsAdminService();
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNews = async (req, res) => {
  try {
    const post = await createNewsService({ ...req.body, author: req.user._id });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const post = await updateNewsService(req.params.id, req.body);
    res.json(post);
  } catch (error) {
    const status = error.message === "Post not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const result = await deleteNewsService(req.params.id);
    res.json(result);
  } catch (error) {
    const status = error.message === "Post not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};
