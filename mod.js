import hyper from 'https://x.nest.land/hyper@1.4.7/mod.js'
import app from 'https://x.nest.land/hyper-app-opine@1.2.3/mod.js'

import dndb from "https://x.nest.land/hyper-adapter-dndb@1.0.0/mod.js";
import cache from "https://x.nest.land/hyper-adapter-sqlite@0.0.4/mod.js";
import fs from "https://x.nest.land/hyper-adapter-fs@1.0.8/mod.js";
import minisearch from "https://x.nest.land/hyper-adapter-minisearch@1.0.11/mod.js";
import queue from 'https://x.nest.land/hyper-adapter-queue@0.0.2/mod.js'

import auth from './auth.js'

const TARGET_DIR = Deno.env.get('TARGET_DIR') || '/tmp'

await hyper({
  app,
  adapters: [
    { port: 'data', plugins: [dndb({ dir: TARGET_DIR })] },
    { port: 'cache', plugins: [cache({ dir: TARGET_DIR })] },
    { port: 'storage', plugins: [fs({ dir: TARGET_DIR })] },
    { port: 'search', plugins: [minisearch()] },
    { port: 'queue', plugins: [queue(TARGET_DIR + '/hyper-queue.db')] }
  ],
  middleware: [auth]
})