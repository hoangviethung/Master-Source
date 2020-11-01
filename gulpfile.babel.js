import { series } from "gulp";
import { render } from "./tasks/render";
import { core } from "./tasks/core";
import { clean } from "./tasks/clean";
import { main } from "./tasks/main";
import { serve } from "./tasks/serve";
import { copyPublic } from "./tasks/copy";

const cleanDist = () => {
  return clean("_dist");
};

export default series(cleanDist, copyPublic, render, core, main, serve);
