from sqlalchemy.ext.compiler import compiles
from sqlalchemy.sql.expression import FunctionElement


# TODO: refactor after https://github.com/Aidbox/aidbox-python-sdk/issues/21


class knife_extract_text(FunctionElement):
    name = "knife_extract_text"


@compiles(knife_extract_text)
def compile_knife_extract_text(element, compiler, **kw):
    return "knife_extract_text(%s)" % compiler.process(element.clauses, **kw)


class knife_extract_max_numeric(FunctionElement):
    name = "knife_extract_max_numeric"


@compiles(knife_extract_max_numeric)
def compile_knife_extract_max_numeric(element, compiler, **kw):
    return "knife_extract_max_numeric(%s)" % compiler.process(element.clauses, **kw)


class knife_extract_min_timestamptz(FunctionElement):
    name = "knife_extract_min_timestamptz"


@compiles(knife_extract_min_timestamptz)
def compile_knife_extract_min_timestamptz(element, compiler, **kw):
    return "knife_extract_min_timestamptz(%s)" % compiler.process(element.clauses, **kw)


class knife_date_bound(FunctionElement):
    name = "knife_date_bound"


@compiles(knife_date_bound)
def compile_knife_date_bound(element, compiler, **kw):
    return "knife_date_bound(%s)" % compiler.process(element.clauses, **kw)


class aidbox_text_search(FunctionElement):
    name = "aidbox_text_search"


@compiles(aidbox_text_search)
def compile_aidbox_text_search(element, compiler, **kw):
    return "aidbox_text_search(%s)" % compiler.process(element.clauses, **kw)


class unaccent(FunctionElement):
    name = "unaccent"


@compiles(unaccent)
def compile_unaccent(element, compiler, **kw):
    return "unaccent(%s)" % compiler.process(element.clauses, **kw)
