/*
 * GDevelop Core
 * Copyright 2008-2023 Florian Rival (Florian.Rival@gmail.com). All rights
 * reserved. This project is released under the MIT License.
 */
#include "GDCore/Project/ObjectFolderOrObject.h"

#include <memory>

#include "GDCore/Project/Object.h"
using namespace std;

namespace gd {

ObjectFolderOrObject::ObjectFolderOrObject() {}
ObjectFolderOrObject::ObjectFolderOrObject(gd::String folderName_)
    : folderName(folderName_) {}
ObjectFolderOrObject::ObjectFolderOrObject(gd::Object* object_)
    : object(object_) {}
ObjectFolderOrObject::~ObjectFolderOrObject() {}

bool ObjectFolderOrObject::HasObjectNamed(const gd::String& name) {
  if (IsFolder()) {
    return std::any_of(
        children.begin(),
        children.end(),
        [&name](
            std::unique_ptr<gd::ObjectFolderOrObject>& objectFolderOrObject) {
          return objectFolderOrObject.get()->HasObjectNamed(name);
        });
  }
  return object->GetName() == name;
}

void ObjectFolderOrObject::InsertObject(gd::Object* insertedObject) {
  auto objectFolderOrObject =
      gd::make_unique<ObjectFolderOrObject>(insertedObject);
  children.push_back(std::move(objectFolderOrObject));
}

}  // namespace gd