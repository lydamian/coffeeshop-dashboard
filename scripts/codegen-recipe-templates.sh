#!/bin/bash

# Define the source template folder
TEMPLATE_FOLDER="./src/app/recipes/template"

# Define the parent directory where new folders will be created (same as template's parent directory)
PARENT_DIR="$(dirname "$TEMPLATE_FOLDER")"

# Define the list of new folder names
NEW_FOLDERS=("simple-syrup" "vanilla-syrup" "black-sugar-syrup" "mixed-berry-syrup")

# Check if the template folder exists
if [ ! -d "$TEMPLATE_FOLDER" ]; then
    echo "Error: Template folder does not exist!"
    exit 1
fi

# Check if the required files exist in the template folder
if [ ! -f "$TEMPLATE_FOLDER/content.mdx" ] || [ ! -f "$TEMPLATE_FOLDER/page.tsx" ]; then
    echo "Error: Required files (content.mdx and page.tsx) not found in the template folder!"
    exit 1
fi

# Loop through the list of new folder names
for folder in "${NEW_FOLDERS[@]}"; do
    # Create the new folder in the same directory as the template folder
    NEW_FOLDER_PATH="$PARENT_DIR/$folder"
    mkdir -p "$NEW_FOLDER_PATH"
    
    # Copy the contents of the template folder to the new folder
    cp "$TEMPLATE_FOLDER/content.mdx" "$TEMPLATE_FOLDER/page.tsx" "$NEW_FOLDER_PATH/"
    
    echo "Copied template contents to $NEW_FOLDER_PATH"
done

echo "All folders created and populated successfully!"