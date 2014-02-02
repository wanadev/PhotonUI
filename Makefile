photonui: FORCE
	python build.py

doc: FORCE
	yuidoc

clean: FORCE
	rm -rf doc/

FORCE:
	@echo
