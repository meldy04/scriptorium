import data from './data'
 
export default function handler(req, res) {
  const { id, tags } = req.query;

  if(id) {
    const postID = Number(id);
    const post = data.find((obj) => obj.id === postID);

    if(!post) {
      return res.status(404).json({error: "Post not found"});
    }
    return res.status(200).json(post);
  }
  
  if (tags) {
    const tagsArray = tags.split(',').map(tag => tag.toLowerCase());
    console.log("Tags Array:", tagsArray);

    const filtered = data.filter(post => {
      const postTags = post.tags.map(t => t.toLowerCase());

      return tagsArray.every(tag => postTags.includes(tag));
    });
  
    return res.status(200).json(filtered);
  }
       
  return res.status(200).json(data); 
}