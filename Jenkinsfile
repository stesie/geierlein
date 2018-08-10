pipeline {
    agent {
        dockerfile { filename 'Dockerfile.jenkins' }
    }
    environment {
        HOME = pwd()
    }
    stages {
        stage('Prepare') {
            steps {
                sh 'echo HOME=$HOME'
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
