pipeline {
    agent any

    environment {
        DEPLOY_ROOT = '/opt/flask-react'
        WEB_ROOT = '/var/www/flask-react'
        VENV = '/opt/flask-react/venv'
        SERVICE = 'flask-react'
        BACKEND_PORT = '5001'
    }

    triggers {
        pollSCM('H/2 * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Setup & Test') {
            steps {
                sh '''
                    set -e
                    python3 -m venv "$VENV"
                    "$VENV/bin/pip" install --upgrade pip
                    "$VENV/bin/pip" install -r server/requirements.txt
                    "$VENV/bin/python" -m py_compile server/app.py server/wsgi.py
                    cd server
                    "$VENV/bin/python" -c "from app import app; print('Flask app import: OK')"
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                dir('client') {
                    sh '''
                        set -e
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                sh '''
                    set -e
                    rm -rf "$DEPLOY_ROOT/server"
                    mkdir -p "$DEPLOY_ROOT/server"
                    cp -r server/. "$DEPLOY_ROOT/server/"
                    chown -R jenkins:jenkins "$DEPLOY_ROOT/server"
                    chown -R jenkins:jenkins "$VENV"
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                    set -e
                    mkdir -p "$WEB_ROOT"
                    rm -rf "$WEB_ROOT"/*
                    cp -r client/dist/. "$WEB_ROOT"/
                    chown -R jenkins:jenkins "$WEB_ROOT"
                '''
            }
        }

        stage('Restart Flask') {
            steps {
                sh '''
                    set -e
                    sudo systemctl restart "$SERVICE"
                    sudo systemctl is-active --quiet "$SERVICE"
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    set -e
                    sleep 2
                    curl --fail --silent --show-error http://127.0.0.1:${BACKEND_PORT}/api/health
                    echo
                '''
            }
        }
    }

    post {
        success {
            echo 'Flask + React deployment completed successfully.'
        }
        failure {
            echo 'Deployment failed. Review the Jenkins console output.'
        }
    }
}
