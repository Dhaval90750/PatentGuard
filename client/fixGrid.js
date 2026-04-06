import fs from 'fs';
import path from 'path';

const targetDir = 'e:\\Patent\\client\\src';

function replaceGrid(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace <Grid item xs={12} sm={6} md={...}> formats with Grid size={{...}}
  content = content.replace(/<Grid\s+item([^>]*)>/g, (match, propsGroup) => {
    // If it already has size, do nothing
    if (propsGroup.includes('size=')) return match;
    
    // Extract xs, sm, md, lg
    const sizeObj = {};
    let newPropsGroup = propsGroup;
    
    // Regex to match xs={12} or xs={6}
    const propKeys = ['xs', 'sm', 'md', 'lg', 'xl'];
    for (const key of propKeys) {
      const regex = new RegExp(`\\b${key}={([\\d]+)}`);
      const keyMatch = propsGroup.match(regex);
      if (keyMatch) {
         sizeObj[key] = keyMatch[1];
         newPropsGroup = newPropsGroup.replace(keyMatch[0], '');
      }
    }

    if (Object.keys(sizeObj).length > 0) {
      const sizeStr = Object.keys(sizeObj).map(k => `${k}: ${sizeObj[k]}`).join(', ');
      // Clean up multiple spaces
      newPropsGroup = newPropsGroup.replace(/\s+/g, ' ').trim();
      return `<Grid size={{ ${sizeStr} }}${newPropsGroup ? ' ' + newPropsGroup : ''}>`;
    }
    
    // If it only had "item" but no xs, sm ...
    return `<Grid${propsGroup.replace(/\s+/g, ' ')}>`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (file.endsWith('.jsx')) {
      replaceGrid(fullPath);
    }
  }
}

traverse(targetDir);
console.log('Search and Replace complete.');
