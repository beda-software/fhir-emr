
{{- define "name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "fullname" -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "aidboxdb.fullname" -}}
{{- printf "%s-%s" .Release.Name "aidboxdb" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "secretname" -}}
{{- printf "%s-%s" .Release.Name "aidbox" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

