module.exports = [
    {
      username: 'Mike',
      visualizations: [{ id: 2, title: 'Price by Country'}],
      config: {
        visualization2: {
          clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET, embedId: process.env.EMBED_ID2,
        }
      }
    },
    {
      username: 'Susan',
      visualizations: [{ id: 1, title: 'Points by Country'}, { id: 2, title: 'Price by Country'}],
      config: {
        visualization1: {
          clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET, embedId: process.env.EMBED_ID,
          filters: [{"column": "country", "operator": "IN", "values": ["Italy", "France", "Spain"]}]
        },
        visualization2: {
          clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET, embedId: process.env.EMBED_ID2,
          filters: [{"column": "country", "operator": "IN", "values": ["Italy", "France", "Spain"]}]
        }
      }
    },
    {
      username: 'Tom',
      visualizations: [{ id: 1, title: 'Points by Country'}],
      config: {
        visualization1: {
          clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET, embedId: process.env.EMBED_ID,
          filters: [{"column": "country", "operator": "IN", "values": ["Croatia", "Brazil", "England"]}]
        },
      }
    },
    {
      username: 'Rachael',
      visualizations: [{ id: 1, title: 'Points by Country'}, { id: 2, title: 'Price by Country'}],
      config: {
        visualization1: {
          clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET, embedId: process.env.EMBED_ID, 
          filters: [{"column": "country", "operator": "IN", "values": ["China", "Australia", "Austria"]}]
        },
        visualization2: {
          clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET, embedId: process.env.EMBED_ID2,
          filters: [{"column": "country", "operator": "IN", "values": ["China", "Australia", "Austria"]}]
        }
      }
    }
  ];