lint:
	pylint --disable=C,r *.py
	
install:
	pip install --upgrade pip &&\
	pip install -r requirements.txt
	
