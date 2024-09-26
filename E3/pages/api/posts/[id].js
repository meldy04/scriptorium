import data from './data'
 
export default function handler(req, res) {
  const { id, tags, page = 1, limit = 10 } = req.query;

  const paginate = (array, page, limit) => {
    const pageNo = Number(page);
    const limitNo = Number(limit);
    const start = (pageNo - 1) * limitNo;
    const end = start + limitNo;

    return array.slice(start, end);
  };

  if(id) {
    const postID = Number(id);
    const post = data.find((obj) => obj.id === postID);

    if(!post) {
      return res.status(404).json({error: "Post not found"});
    }
    return res.status(200).json(post);
  }

  let filtered = data;
  
  if (tags) {
    const tagsArray = tags.split(',').map(tag => tag.toLowerCase());

    filtered = filtered.filter(post => {
      const postTags = post.tags.map(t => t.toLowerCase());
      return tagsArray.every(tag => postTags.includes(tag));
    });
  }
  const paginated = paginate(filtered, page, limit);
       
  return res.status(200).json(paginated); 
}