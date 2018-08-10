pipeline {
    agent {
        dockerfile { filename 'Dockerfile.jenkins' }
    }
    stages {
        stage('Prepare') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Package') {
            steps {
                sh 'npm run package'
            }
        }
    }
}
