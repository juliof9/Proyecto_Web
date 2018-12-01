module.exports = {


  friendlyName: 'Destroy one document',


  description: 'Delete one document from the database ',


  inputs: {
    id: {
      type: "number",
      required: true
    },
  },


  exits: {
    forbidden: {
      description: 'The user making this request does not have the permission to do it.',
      responseType: 'forbidden'
    }
  },


  fn: async function ({id}) {

    // All done.
    console.log(id);
    
    var doc = await Documents.findOne({
      id: id
    });
    if(!doc)
    {
      throw 'forbidden'
    }
    if(doc.owner !== this.req.me.id){
      throw 'forbidden';
    }

    await Documents.destroy({ id: id});
    return;

  }


};
