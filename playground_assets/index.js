var mapResources = [{
	'name': 'hidden',
	'resources': [
		'variables=__variables(less)',
		'functions=_functions(less,js,nowrap)'
		// nowrap Se agrega para que no se wrapee el contenido		
	]
}, {
	'name': 'Text',
	'resources': [
		'Heading=heading(less,html)',
		'Text=basic(less,html)',
		'Lists (ul, ol)=lists(less,html)',
		'Table=table(less,html)',
		'Pre & Code=pre(less,html,js)'
	]
}, {
	'name': 'Inputs',
	'resources': [
		'Form=form(less,html,js)',
		'Input Group=input-groups(less,html)',
		'Button=buttons(less,html)',
		'Group of Buttons=button-groups(less,html)',
		'Dropdown=dropdown(less,html,js)'
	]
}, {
	'name': 'Image & Media',
	'resources': [
		'Font Awesome Icons=icons(less,html)',
		'Image responsive=image-responsive(less,html)'
	]
}, {
	'name': 'Box Model',
	'resources': [
		'Grid=box-model(less,html)'
	]
}, {
	'name': 'Parts',
	'resources': [
		'Tabs=tabs(less,html,js)',
		'Modal=modal(less,html,js)',
		'Tooltip=tooltip(less,html,js)',
		'Alert=alert(less,html,js)',
		'Collapser=collapser(less,html,js)',
		'Carousel=carousel(less,html,js)',
		'Panel=panel(less,html)'
	]
}, {
	'name': 'Components',
	'resources': [
		'Parallax=parallax(less,html,js,nowrap)'
	]
}];