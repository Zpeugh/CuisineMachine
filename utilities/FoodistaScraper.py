from bs4 import BeautifulSoup
import urllib

#number of search pages 261


delimiter = "; "
spacer = " "*12

def sanitize(s):
  #if "<>" in s
  return s.replace("\\","\\\\").replace('"',"\\\"").replace("\r","").replace("\n","").replace("\t"," ").strip().encode('utf8')

def writeRecipeToFile(file_obj, recipe):
  
  title = sanitize(recipe.find("h1",id="page-title").string)
  
  id_number = recipe.head.find("link")["href"][31:39]
  if id_number == "":
    print "invalid id on recipe: ", title
    return

  picture = ""
  picture_div = recipe.find("div",class_="featured-image")
  if picture_div is not None:
    picture = picture_div.img["src"]

  #needs fixing, esp remove links
  ingredients = ""
  ingredients_outer_div = recipe.find("div",class_="pane-node-field-rec-ing")
  if ingredients_outer_div is not None: 
    ingredients_field_items = ingredients_outer_div.find("div",class_="field-items")
    if ingredients_field_items is not None: 
      for ingredient_item in ingredients_field_items.children:
        #if str(type(ingredient_item)) == "<class 'bs4.element.NavigableString'>" :
          #ingredients = ingredients + ingredient_item.string + delimiter
        if str(type(ingredient_item)) == "<class 'bs4.element.Tag'>" :
          if ingredient_item.get_text() == "":
            break; #this may break stuff
          ingredients = ingredients + ingredient_item.get_text() + delimiter
  if ingredients.endswith(delimiter):
    ingredients = ingredients[:-1*len(delimiter)]
  ingredients = sanitize(ingredients)

  instructions = ""
  instructions_outer_div = recipe.find("div",class_="pane-node-field-rec-steps")
  if instructions_outer_div is not None: 
    instructions_field_items = instructions_outer_div.find("div",class_="field-items")
    for instruction_item in instructions_field_items.children:
      if instruction_item is not None and str(type(instruction_item)) == "<class 'bs4.element.Tag'>":
        instruction_step_number = instruction_item.find("div",class_="step-number")
        instruction_step_body = instruction_item.find("div",class_="step-body")
        if instruction_step_number is not None and instruction_step_body is not None:
          instructions = instructions + instruction_step_number.string + delimiter 
          instructions = instructions + instruction_step_body.get_text() + delimiter
  if instructions.endswith(delimiter):
    instructions = instructions[:-1*len(delimiter)]
  instructions = sanitize(instructions)

  about = ""
  about_div = recipe.find("div",class_="field-type-text-with-summary")
  if about_div is not None: 
    about_p = about_div.find("p")
    if about_p is not None and about_p.string is not None: 
      about = sanitize(about_p.string)
  
  recipe_yield = ""
  yield_outer_div = recipe.find("div",class_="pane-node-field-yield")
  if yield_outer_div is not None:
    yield_item = yield_outer_div.find("div",class_="field-item")
    if yield_item is not None and yield_item.string is not None:
      recipe_yield = sanitize(yield_item.string)

  tags = ""
  tags_outer_div = recipe.find("div",class_="pane-node-field-tags")
  if tags_outer_div is not None:
    tags_field_items = tags_outer_div.find("div",class_="field-items")
    for tag_item in tags_field_items.children:
      if tag_item is not None and tag_item.string is not None: 
        tags = tags + tag_item.string + delimiter
  if tags.endswith(delimiter):
    tags = tags[:-1*len(delimiter)]
  tags = sanitize(tags)

  recipe_text = '        {{\n{8}"id":"{0}",\n{8}"title": "{1}",\n{8}"picture": "{2}",\n{8}"ingredients": "{3}",\n{8}"instructions": "{4}",\n{8}"about": "{5}",\n{8}"yield": "{6}",\n{8}"tags": "{7}"\n        }},\n'.format(id_number, title, picture, ingredients, instructions, about, recipe_yield, tags, spacer)
  file_obj.write(recipe_text)
  
#main
json = open("recipes.json","w")
json.write('{\n    "recipes": [\n')
for i in range(0,1):
  print "scraping page ", i
  searchpage = BeautifulSoup(urllib.urlopen("http://foodista.com/browse/recipes?page=" + str(i)),'html.parser')
  for element in searchpage.find_all("span"):
    recipe_html = BeautifulSoup(urllib.urlopen("http://foodista.com" + element.a["href"]),'html.parser')
    writeRecipeToFile(json,recipe_html)
json.seek(-2, 1)
json.truncate()
json.write('\n    ]\n}')
json.close()
