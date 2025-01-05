# manz

## Local dev

Enable pre-commit test for the repo `git config --local core.hooksPath .githooks/hooks`.

### Frontend

```bash
cd frontend
npm run dev
```

Edit the `.env.local.example` to `.env.local`.

### Backend

```bash
cd backend
python manage.py runserver
```

Edit the `.env.example` to `.env`.

## Objectives

### Skeleton decription - Web application meal planner

Users can register recipes, schedule meal base on the their recipe and List items needed to cook all the meals
over a period of time.

Build a delivery pipeline:
- [x] Build a working skeleton
- [x] Create a commit stage the automate tests with github action
- [ ] Build and save an artefact of the code on dockerhub
- [ ] Deploy on a test environment 
- [ ] Have acceptance test executed on a test environment
- [ ] Release the app into production

### Questions

**Where do you thing your are now ?**

I have a working skeleton on a Github repository.

**What is your objective?**

Build a fully functionnal deployment pipeline.

**What Is Your Next Step?**

Add Continous Integration test with github action.

**How will I know if have succeeded ?**

When I have an automated process from commit to release code into production.


