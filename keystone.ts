// keystone.ts

import { config, list } from '@keystone-6/core';
import { text } from '@keystone-6/core/fields';
import { Lists } from '.keystone/types';

function newWebpage(name: string){
  var fs = require('fs');
  var os = require("os");
  const newFile = 'data/'+name+'.json';
  const newPage = 'pages/'+name+'.tsx';
  const link = 'localhost:3000/'+name;
  fs.open(newFile, 'w', function (_err: any, _f: any) {
    console.log(newFile+" has been created");
  });
  fs.appendFile(newPage, "import 'grapesjs/dist/css/grapes.min.css'"+os.EOL,function (_err: any, _f: any) {});
  fs.appendFile(newPage, "export { getStaticProps } from 'destack/build/server'"+os.EOL,function (_err: any, _f: any) {});
  fs.appendFile(newPage, "export { ContentProvider as default } from 'destack'"+os.EOL,function (_err: any, _f: any) {});
}

function deleteWebpage(name: string){
  var fs = require('fs');
  const deleteFile = 'data/'+name+'.json';
  const deletePage = 'pages/'+name+'.tsx';
  fs.unlink(deleteFile, function (err: any) {
    if (err) throw err;
    console.log(deleteFile+' has been deleted!');
  });
  fs.unlink(deletePage, function (err: any) {});
}

function openWebpage(name: string){
  
}

const Page: Lists.Page = list({
  fields: {
    title: text({ validation: { isRequired: true } }),
    slug: text({ isIndexed: 'unique', isFilterable: true }),
    content: text(),
  },
  hooks: {
    afterOperation: ({ operation, item }) => {
      if (operation === 'create') {
        //console.log(item.slug+" has been created");
        newWebpage(item.slug);
        openWebpage(item.slug);
      }
      else if(operation === 'update') {
        openWebpage(item.slug);
      }
    },
    beforeOperation: ({ operation, item }) => {
       if (operation === 'delete') {
        deleteWebpage(item.slug);
      }
    },
  },

});

export default config({
  db: { provider: 'sqlite', url: 'file:./app.db' },
  experimental: {
    generateNextGraphqlAPI: true,
    generateNodeAPI: true,
  },
  lists: { Page },
});
