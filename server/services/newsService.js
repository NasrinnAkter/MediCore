import News from "../models/News.js";

export const getNewsService = async ({
  search,
  category,
  page = 1,
  limit = 6,
} = {}) => {
  const filter = { published: true };
  if (search) filter.title = { $regex: search, $options: "i" };
  if (category) filter.category = { $regex: category, $options: "i" };

  const total = await News.countDocuments(filter);
  const news = await News.find(filter)
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return {
    news,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

export const getNewsByIdService = async (id) => {
  const post = await News.findById(id).populate("author", "name");
  if (!post) throw new Error("Post not found");
  return post;
};

export const getAllNewsAdminService = async () => {
  return await News.find().populate("author", "name").sort({ createdAt: -1 });
};

export const createNewsService = async (data) => {
  return await News.create(data);
};

export const updateNewsService = async (id, data) => {
  const post = await News.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!post) throw new Error("Post not found");
  return post;
};

export const deleteNewsService = async (id) => {
  const post = await News.findByIdAndDelete(id);
  if (!post) throw new Error("Post not found");
  return { message: "Post removed" };
};
