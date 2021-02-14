import { series } from 'gulp';
import { render } from './@core/tasks/render';
import { core } from './@core/tasks/core';
import { clean } from './@core/tasks/clean';
import { main } from './@core/tasks/main';
import { serve } from './@core/tasks/serve';
import { copyPublic } from './@core/tasks/copy';

const cleanDist = () => {
	return clean('_dist');
};

export const dev = series(cleanDist, copyPublic, core, main, render, serve);

export const prod = series(cleanDist, copyPublic, core, main, render, serve);
