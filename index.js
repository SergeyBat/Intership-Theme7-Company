class Project {
	constructor(options) {
		this.items = options.items;
		this.level = options.level;
		this.status = options.status;
	}
	daysInOperation = 0;
	numberOfDevelopersEmployed = 0;

	changedaysInOperation() {
		this.daysInOperation += 1;
	}

}

class Programmer {
	constructor(position, numberOfProject = 0) {
		this.position = position;
		this.numberOfProject = numberOfProject;
	}
	statusWork = 'free';
	isWorker = true;
}


class Company {
	projectList = [];
	programmerList = [];
	listOfCompletedProjects = [];
	listOfDelProgrammer = [];
	listOfDepartments = {};

	projectStatus = {
		dontWork: 'dontWork',
		atWork: 'atWork',
		ready: 'ready',
		test: 'test',
		completed: 'completed'
	};
	itemsProject = ['web', 'mobile'];


	positionProgrammer = {
		Web: 'web',
		Mobile: 'mobile',
		QA: 'qa'
	}

	statusWorkForProgrammer = {
		busy: 'busy',
		free: 'free'
	};


	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
	}

	getFreeProgrammer() {
		return this.programmerList.filter(e => e.statusWork === this.statusWorkForProgrammer.free)
	}



}

class Department extends Company {
	constructor(name) {
		super();
		this._name = name;
	}

	getName() {
		return this._name
	}

	getProject(project) {
		this.projectList.push(project)
	}

	addProgrammer(programmer) {
		this.programmerList.push(programmer)
	}


}


class Boss extends Company {
	constructor() {
		super();
		this.listOfDepartments.webDep = (new Department('Web'));
		this.listOfDepartments.mobileDep = (new Department('Mobile'));
		this.listOfDepartments.qaDep = (new Department('QA'));
	}


	addProgrammer() {
		if (this.projectList.length > 0) {
			for (let i = 0; i < this.projectList.filter(e => e.items == this.positionProgrammer.Web).length; i++) {
				this.listOfDepartments.webDep.programmerList.push(new Programmer(this.positionProgrammer.Web));
			}
			for (let i = 0; i < this.projectList.filter(e => e.items == this.positionProgrammer.Mobile).length; i++) {
				this.listOfDepartments.mobileDep.programmerList.push(new Programmer(this.positionProgrammer.Mobile));
			}
			for (let i = 0; i < this.projectList.filter(e => e.items == this.positionProgrammer.QA).length; i++) {
				this.listOfDepartments.qaDep.programmerList.push(new Programmer(this.positionProgrammer.QA));
			}
		}
	}

	addProject() {
		let numberOfProject = this.getRandomInt(0, 5);
		if (numberOfProject != 0) {
			for (let i = 0; i < numberOfProject; i++) {
				let project = {}
				project.items = this.itemsProject[Math.floor(Math.random() * this.itemsProject.length)];
				project.level = this.getRandomInt(1, 4);
				project.status = this.projectStatus.dontWork;
				this.projectList.push(new Project(project));
			};
		};
	};

	giveProjectsToDevelopers() {
		if (this.projectList.length > 0) {
			const change = changeInformation.bind(this);
			const changeProjectInf = changeInformationProjectAtWork.bind(this)
			let webProjects = this.projectList.filter(e => e.items == this.itemsProject[0]);
			let webProgrammer = this.listOfDepartments.webDep.getFreeProgrammer().filter(e => e.position == this.positionProgrammer.Web);

			let mobileProjects = this.projectList.filter(e => e.items == this.itemsProject[1]);
			let mobileProgrammer = this.listOfDepartments.mobileDep.getFreeProgrammer().filter(e => e.position == this.positionProgrammer.Mobile);
			if (webProjects.length > 0) {
				change(webProjects, this.listOfDepartments.webDep, webProgrammer);
				this.projectList = this.projectList.filter(e => e.status != this.projectStatus.atWork)
			}
			if (mobileProjects.length > 0) {
				change(mobileProjects, this.listOfDepartments.mobileDep, mobileProgrammer);
				this.projectList = this.projectList.filter(e => e.status != this.projectStatus.atWork)
			}
			mobileProjects = this.listOfDepartments.mobileDep.projectList.filter(e => e.level == 2 || e.level == 3);
			mobileProgrammer = this.listOfDepartments.mobileDep.getFreeProgrammer().filter(e => e.statusWork == this.statusWorkForProgrammer.free);
			if (mobileProjects.length > 0) {
				while (mobileProjects.length != 0) {
					if (mobileProgrammer.length > 0) {
						changeProjectInf(mobileProjects, mobileProgrammer);
						mobileProjects = this.listOfDepartments.mobileDep.projectList.filter(e => e.level == 3 && e.numberOfDevelopersEmployed < 3);
						mobileProgrammer = this.listOfDepartments.mobileDep.getFreeProgrammer().filter(e => e.statusWork == this.statusWorkForProgrammer.free);
					} else {
						break
					}
				}
			}

		};

		function changeInformationProjectAtWork(mobProject, freeProgrammer) {
			mobProject.forEach((e, index) => {
				if (freeProgrammer.length > 0) {
					e.numberOfDevelopersEmployed += 1
					freeProgrammer[index].statusWork = this.statusWorkForProgrammer.busy;
					freeProgrammer[index].numberOfProject += 1;
				}
			})


		}

		function changeInformation(typeProject, dep, freeProgrammer) {
			if (typeProject.length > 0) {
				typeProject.forEach((e, index) => {
					if (dep.getFreeProgrammer().length > 0) {
						e.status = this.projectStatus.atWork;
						e.numberOfDevelopersEmployed += 1;

						e.changedaysInOperation();
						dep.projectList.push(e)
						freeProgrammer[index].statusWork = this.statusWorkForProgrammer.busy;
						freeProgrammer[index].numberOfProject += 1;
					}
				});
			}
		}

	};

}

let boss = new Boss();
boss.addProject();
console.log(boss.projectList.length);
boss.addProgrammer()
boss.giveProjectsToDevelopers();
// console.log(boss.listOfDepartments.webDep.projectList)
console.log(boss.listOfDepartments.mobileDep.projectList)




/* 
work(3)
function work(day) {
	for (let i = day; i > 0; i--) {
		boss.addProject()
		boss.distributionProject()
	}
	console.log(boss.projectsList)
	console.log(webDep.listProgrammer)
	console.log(mobileDep.listProgrammer)
}
*/