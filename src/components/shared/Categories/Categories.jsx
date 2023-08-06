import React from "react";
import Container from "../Container/Container";
import { categories } from "./categoriesData";
import CategoryBox from "./CategoryBox";

const Categories = () => {
  return (
    <Container>
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {categories.map((val) => (
          <CategoryBox label={val.label} icon={val.icon} key={val.label} />
        ))}
      </div>
    </Container>
  );
};

export default Categories;
