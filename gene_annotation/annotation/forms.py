from django import forms

class GeneInputForm(forms.Form):
    gene = forms.CharField(
        label="Gene Name",
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter Gene Name (e.g., BRCA1)',
        })
    )

    sequence = forms.CharField(
        label="Gene Sequence",
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 3,
            'placeholder': 'Enter Gene Sequence (e.g., ATGCCC...)',
        })
    )

    def clean_sequence(self):
        """Ensure the sequence only contains valid nucleotide characters (A, T, G, C)."""
        sequence = self.cleaned_data['sequence'].strip().upper()
        valid_chars = set("ATGC")
        
        if not set(sequence).issubset(valid_chars):
            raise forms.ValidationError("Invalid sequence! Only A, T, G, C are allowed.")

        return sequence
